import { JSX } from "react";
import { Metadata } from "next";
import BackToTop from "../../components/BackToTop";
import Header from "../../components/Header";
import MobileHeader from "../../components/MobileHeader";
import Footer from "../../components/Footer";
import CreatePostPageContent from "../../components/CreatePostPageContent";

export const metadata: Metadata = {
  title: "Crear Post - Foro Programadores Argentina",
  description: "Crea un nuevo post en el foro de Programadores Argentina. Comparte conocimientos, preguntas técnicas y conecta con la comunidad.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreatePost(): JSX.Element {
  return (
    <>
      <BackToTop />
      <Header />
      <MobileHeader />
      <CreatePostPageContent />
      <Footer />
    </>
  );
}
