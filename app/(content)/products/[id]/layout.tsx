import "@/styles/globals.css";
interface ModalProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}
export default function NewsDetailLayout({ children, modal }: ModalProps) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
