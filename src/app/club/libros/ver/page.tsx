import { JSX } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getBook } from "@/lib/books";
import BookViewer from "./components/BookViewer";

interface BookPageProps {
  searchParams: {
    path?: string;
  };
}

export async function generateMetadata({ searchParams }: BookPageProps): Promise<Metadata> {
  const bookPath = searchParams.path;
  
  if (!bookPath) {
    return {
      title: "Libro no encontrado | Club Programadores Argentina",
      description: "El libro que buscas no existe o no está disponible.",
    };
  }

  const book = await getBook(bookPath);

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
    robots: {
      index: false, // No indexar páginas individuales de libros
      follow: false,
    },
  };
}

export default async function BookPage({ searchParams }: BookPageProps): Promise<JSX.Element> {
  const bookPath = searchParams.path;
  
  console.log('📚 Book viewer page (query):', {
    bookPath
  });
  
  // Si no hay path, redirigir a la biblioteca
  if (!bookPath) {
    redirect('/club/libros');
  }

  const book = await getBook(bookPath);

  // Si el libro no existe, redirigir a la biblioteca
  if (!book) {
    redirect('/club/libros');
  }

  return (
    <>
      <BookViewer book={book} />
    </>
  );
}

