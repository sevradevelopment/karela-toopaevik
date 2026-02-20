import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Tankimine from '@/pages/Tankimine'
import Tunnid from '@/pages/Tunnid'
import Vedu from '@/pages/Vedu'
import Tootmine from '@/pages/Tootmine'
import Logid from '@/pages/Logid'
import Statistika from '@/pages/Statistika'
import Haldus from '@/pages/Haldus'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/tankimine" element={<Tankimine />} />
            <Route path="/tunnid" element={<Tunnid />} />
            <Route path="/vedu" element={<Vedu />} />
            <Route path="/tootmine" element={<Tootmine />} />
            <Route path="/logid" element={<Logid />} />
            <Route path="/statistika" element={<Statistika />} />
            <Route path="/haldus" element={<Haldus />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </AuthProvider>
  )
}
