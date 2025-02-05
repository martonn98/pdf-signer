import { FileSignature } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <FileSignature className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-semibold">PDF Signer</span>
          </div>
        </div>
      </div>
    </header>
  )
}

