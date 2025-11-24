import { Film, QrCode, Shield, Zap } from 'lucide-react'
import React from 'react'
import QRCode from 'react-qr-code'

function QRLogin() {

  return (
    <div className="rounded-3xl shadow-lg border p-6 relative overflow-hidden ">
          {/* Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
              <QrCode className="w-6 h-6 text-purple-900" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-purple-900">QR CODE LOGIN</h2>
              <p className="text-gray-800 text-sm">Scan with your mobile app</p>
            </div>
          </div>

          {/* QR Code Box */}
          <div className="bg-white rounded-3xl py-10 m-8 mx-12 flex items-center justify-center shadow-md">
            <QRCode value="EAARTH-STUDIOS-LOGIN" size={240} level="H" fgColor="#7C3AED" />
          </div>

          {/* How-To Steps */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm mb-3 text-purple-900">How to use:</h3>

            {[
              "Open Eaarth Studios mobile app",
              "Tap the QR Login button",
              "Scan this code with your camera",
              "You'll be logged in instantly!",
            ].map((t, i) => (
              <div className="flex items-center gap-3" key={i}>
                <div className="w-8 h-8 rounded-md bg-purple-900/20 flex items-center justify-center text-purple-900 text-xs font-medium">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-800">{t}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-purple-900/20">
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, text: "SECURE" },
                { icon: Zap, text: "INSTANT" },
                { icon: Film, text: "EASY" },
              ].map(({ icon: Icon, text }) => (
                <div className="text-center" key={text}>
                  <div className="w-10 h-10 mx-auto mb-2 bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-purple-900" />
                  </div>
                  <p className="text-[10px] font-medium text-purple-900">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default QRLogin