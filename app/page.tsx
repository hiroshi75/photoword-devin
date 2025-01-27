import { UploadArea } from "@/app/components/upload/UploadArea";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">PhotoWord</h1>
        <UploadArea />
      </div>
    </main>
  );
}
