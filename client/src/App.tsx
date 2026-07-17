import { AppProviders } from "./providers/AppProvider"
import { AppRoutes } from "./routes/AppRoutes"
import { Toaster } from 'sonner'


const App = () => {
  return (
    <AppProviders>
       <AppRoutes />
      <Toaster
        richColors
        position="top-right"
      />
    </AppProviders>


  )
}

export default App
