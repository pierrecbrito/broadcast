import { useParams } from "react-router-dom";

export function ContactsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Contatos da Conexao: {id}</h1>
    </div>
  );
}
