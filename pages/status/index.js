import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-br");
  }
  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let versionUpdatedAtText = "Carregando...";
  let OpenedConnectionsText = "Carregando...";
  let MaxConnectionsText = "Carregando...";

  if (!isLoading && data) {
    versionUpdatedAtText = data.dependencies.database.version;
    OpenedConnectionsText = data.dependencies.database.opened_connections;
    MaxConnectionsText = data.dependencies.database.max_connections;
  }
  return (
    <>
      <h1>Database</h1>
      <p>Versão: {versionUpdatedAtText}</p>
      <p>Conexões Abertas: {OpenedConnectionsText}</p>
      <p>Conexões Máximas: {MaxConnectionsText}</p>
    </>
  );
}
