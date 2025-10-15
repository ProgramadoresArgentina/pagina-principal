import { JSX } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import BookViewer from "./components/BookViewer";
import BookPageClient from "./components/BookPageClient";

interface BookPageProps {
  params: {
    filename: string;
  };
}

export async function generateStaticParams() {
  try {
    const { getBooks } = await import('@/lib/books');
    const books = await getBooks();
    return books.map((book) => ({
      filename: book.filename,
    }));
  } catch (error) {
    console.error('Error generating static params for books:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const book = await getBook(params.filename);

  if (!book) {
    return {
      title: "Libro no encontrado | Club Programadores Argentina",
      description: "El libro que buscas no existe o no está disponible.",
    };
  }

  return {
    title: `${book.title} | Club Programadores Argentina`,
    description: `Lee ${book.title} en la biblioteca exclusiva del Club Programadores Argentina.`,
    keywords: [
      "libro programación",
      "libro técnico",
      "programación argentina",
      "desarrollo software",
      "club programadores argentina",
      book.title.toLowerCase()
    ],
    authors: [{ name: "Programadores Argentina" }],
    creator: "Programadores Argentina",
    publisher: "Programadores Argentina",
    metadataBase: new URL("https://programadoresargentina.com"),
    alternates: {
      canonical: `/club/libros/${params.filename}`,
    },
    openGraph: {
      title: `${book.title} | Club Programadores Argentina`,
      description: `Lee ${book.title} en la biblioteca exclusiva del Club Programadores Argentina.`,
      url: `https://programadoresargentina.com/club/libros/${params.filename}`,
      siteName: "Programadores Argentina",
      images: [
        {
          url: "/assets/images/logo-club.png",
          width: 1200,
          height: 630,
          alt: `${book.title} - Club Programadores Argentina`,
        },
      ],
      locale: "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} | Club Programadores Argentina`,
      description: `Lee ${book.title} en la biblioteca exclusiva del Club Programadores Argentina.`,
      images: ["/assets/images/logo-club.png"],
      creator: "@programadores_argentina",
    },
    robots: {
      index: false, // No indexar páginas individuales de libros
      follow: false,
    },
  };
}

export default async function BookPage({ params }: BookPageProps): Promise<JSX.Element> {
  const book = await getBook(params.filename);

  if (!book) {
    notFound();
  }

  return (
    <>
      <BookPageClient book={book} />
    </>
  );
}
