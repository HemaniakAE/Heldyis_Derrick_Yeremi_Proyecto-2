function ResetButton({ onReset }) {
  return (
    <button className="reset-button" title='Resetear' onClick={onReset}>
      <img src="/caballo_logo.png" alt="Reset" />
    </button>
  );
}

export default ResetButton;
