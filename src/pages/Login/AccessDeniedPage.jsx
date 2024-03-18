
const AccessDeniedPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Acceso Denegado</h1>
      <p style={styles.message}>Lo sentimos, no tienes permiso para acceder a esta página.</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    marginTop: '50px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  message: {
    fontSize: '16px',
  },
};

export default AccessDeniedPage;
