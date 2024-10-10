const Policy = () => {
  return (
    <div className="py-4">
      <ol className="mx-4 flex flex-col gap-1">
        <li>1. We do not store any user information.</li>
        <li>2. No user information is sent to any third-party dependency.</li>
        <li>3. The query entered and the response is NOT used for model training.</li>
      </ol>
    </div>
  )
}

export default Policy