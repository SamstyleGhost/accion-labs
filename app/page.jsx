import { Disclaimer, InfoTab, Chat } from "@components"

export default function Home() {
  return (
    <div className="mt-6 flex flex-col md:flex-row-reverse flex-grow">
      <div className="flex flex-col w-full h-full md:w-3/4">
        <Disclaimer />
        <hr className="my-4"/>
        <Chat />
      </div>
      <InfoTab />
    </div>
  )
}
