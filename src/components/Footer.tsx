import { FaGithub } from 'react-icons/fa'

export const Footer = () => (
  <footer>
    <span className="my-10">
      © 2025 Vicentart. All rights reserved.
      <a href="https://github.com/FEMADOX" className="hover:text-gray-300 cursor-pointer">
        <FaGithub className="inline mb-1 ml-2" />
      </a>
    </span>
  </footer>
)
