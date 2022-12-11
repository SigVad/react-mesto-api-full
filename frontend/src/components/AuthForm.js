function AuthForm({
  name,
  title,
  buttonName,
  onSubmit,
  children
}) {
  return (
    <>
        <section className="auth">
          <h2 className="popup__title auth__title">{title}</h2>
          <form className="popup__form auth__form" name={name} onSubmit={onSubmit}>
            {children}
            <button type="submit" className="popup__button auth__button">{buttonName}</button>
          </form>
        </section>
    </>
  )
}

export default AuthForm;