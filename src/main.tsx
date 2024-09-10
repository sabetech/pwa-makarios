import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ConfigProvider } from "antd-mobile";
import enUS from 'antd-mobile/es/locales/en-US'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={enUS}>
       <App />
    </ConfigProvider>
  </React.StrictMode>,
)
