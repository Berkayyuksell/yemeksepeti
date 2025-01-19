export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Yemeksepeti
          </p>
        </div>
      </div>
    </footer>
  );
} 