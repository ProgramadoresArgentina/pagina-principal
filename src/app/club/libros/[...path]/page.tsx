import { JSX } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import BookViewer from "./components/BookViewer";

interface BookPageProps {
  params: {
    path: string[];
  };
}

export async function generateStaticParams() {
  try {
    const { getBooks } = await import('@/lib/books');
    const books = await getBooks();
    return books.map((book) => {
      // Remover book.pdf del filename para obtener solo categoria/libro
      const pathWithoutPdf = book.filename.replace('/book.pdf', '');
      return {
        path: pathWithoutPdf.split('/'),
      };
    });
  } catch (error) {
    console.error('Error generating static params for books:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const bookKey = params.path.join('/');
  const filename = `${bookKey}/book.pdf`;
  const book = await getBook(filename);

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
      canonical: `/club/libros/${filename}`,
    },
    openGraph: {
      title: `${book.title} | Club Programadores Argentina`,
      description: `Lee ${book.title} en la biblioteca exclusiva del Club Programadores Argentina.`,
      url: `https://programadoresargentina.com/club/libros/${filename}`,
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
  // Construir el filename agregando book.pdf al final
  const bookKey = params.path.join('/');
  const filename = `${bookKey}/book.pdf`;
  
  console.log('📚 Book viewer page:', {
    rawPath: params.path,
    bookKey,
    filename
  });
  
  const book = await getBook(filename);

  if (!book) {
    notFound();
  }

  return (
    <>
      <BookViewer book={book} />
    </>
  );
}

