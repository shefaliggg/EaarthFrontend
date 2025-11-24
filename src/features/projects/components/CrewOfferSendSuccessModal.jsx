import { Bell, Check, Mail } from 'lucide-react'
import React from 'react'

function CrewOfferSendSuccessModal({ formData }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl p-8 max-w-md w-full bg-white dark:bg-gray-800">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            OFFER SENT SUCCESSFULLY!
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-[#faf5ff] dark:bg-gray-900/30">
              <Mail className="w-5 h-5 text-[#9333ea] dark:text-[#c084fc]" />
              <div className="text-left flex-1">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  EMAIL SENT
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  TO: {formData?.email || "N/A"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  FROM: noreply@eaarthstudios.com
                </p>
              </div>
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>

            <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <Bell className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <div className="text-left flex-1">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  IN-APP NOTIFICATION
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  User not on platform - Email only
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-500">
            This dialog will close automatically in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}

export default CrewOfferSendSuccessModal







