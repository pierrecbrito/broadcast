import { useParams } from "react-router-dom";

export function MessagesPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Mensagens da Conexao: {id}</h1>
    </div>
  );
}
