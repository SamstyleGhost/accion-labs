import Link from 'next/link'

const Disclaimer = () => {
  return (
    <div className="w-full text-center">
      <div className="font-medium">Disclaimer</div>
      <div className="text-xs flex justify-center gap-1 w-full">
        <span className=''>
          By using this application, you agree to the terms and conditions described in 
        </span>
        <Link href='/terms-conditions' className='italic underline underline-offset-2'>Terms & Conditions</Link>
      </div>
    </div>
  )
}

export default Disclaimer