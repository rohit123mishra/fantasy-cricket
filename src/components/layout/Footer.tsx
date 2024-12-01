const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            © 2024 Fantasy Cricket. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;