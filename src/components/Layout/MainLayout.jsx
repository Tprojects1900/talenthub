import Navbar from '../Navbar'
import { Footer } from '../Footer'

/**
 * MainLayout - Layout principal pour toutes les pages
 */
export const MainLayout = ({ children, onAdminClick }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar key="navbar"/>

      {/* Main Content */}
      <main key={"main"} className="flex-1 w-full pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
