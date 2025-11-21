import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BadgeCheck, Edit3, Save, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function ProfileSummary({ 
  profile, 
  isDarkMode, 
  isEditing, 
  setIsEditing, 
  handleSave, 
  handleCancel 
}) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [isVerified] = useState(true);

  return (
    <div className="space-y-4">
      {/* Header with Title and Buttons - Outside Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              MY PROFILE
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowQRModal(!showQRModal)}
            className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            SHOW QR CODE
          </button>

          {isEditing ? (
            <>
              <button 
                onClick={handleSave} 
                className="px-4 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-all text-sm font-medium"
              >
                <Save className="w-4 h-4" /> SAVE
              </button>
              <button 
                onClick={handleCancel} 
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
              >
                CANCEL
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="px-4 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-all text-sm font-medium"
            >
              <Edit3 className="w-4 h-4" /> EDIT
            </button>
          )}
        </div>
      </div>

      {/* QR Code Modal - Outside Card */}
      {showQRModal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <div className="flex items-start gap-6">
            {/* Left: User Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profile.firstName.toUpperCase()} {profile.lastName.toUpperCase()}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  DIRECTOR OF PHOTOGRAPHY
                </p>
              </div>
            </div>

            {/* Center: QR Code */}
            <div className="bg-white p-4 rounded-xl border-4 border-purple-600">
              <QRCode
                value="https://eaarth.app/crew/js-2024-dop"
                size={180}
                level="H"
              />
              <div className="text-center mt-3">
                <div className="font-bold text-xs text-gray-900 bg-purple-100 px-2 py-1 rounded-full border-2 border-purple-300">
                  ID: JS-2024-DOP
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1">
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                SCAN TO ACCESS MY PROFILE
              </h4>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Use the <strong>Eaarth Phone App</strong> to scan this QR code for:
              </p>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">●</span>
                  <span><strong>Quick Login</strong> - Access your profile on mobile devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">●</span>
                  <span><strong>Digital Crew Pass</strong> - Show your credentials on set</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">●</span>
                  <span><strong>Contact Card</strong> - Share your professional info instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">●</span>
                  <span><strong>Schedule Sync</strong> - View your call times and bookings</span>
                </li>
              </ul>
              <div className={`mt-3 p-2 rounded-lg text-xs ${
                isDarkMode ? 'bg-gray-700' : 'bg-purple-50'
              }`}>
                <strong className={isDarkMode ? 'text-purple-400' : 'text-purple-700'}>Profile URL:</strong>
                <span className={`ml-1 ${isDarkMode ? 'text-gray-400' : 'text-purple-600'}`}>
                  https://eaarth.app/crew/js-2024-dop
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              {isVerified && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow-lg">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Name & Details */}
            <div>
              <h2 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {profile.firstName} {profile.lastName}
              </h2>
              <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                DIRECTOR OF PHOTOGRAPHY
              </p>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold">
                  <BadgeCheck className="w-3 h-3" /> EAARTH VERIFIED
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                12
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                PROJECTS
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                36
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                PENDING DOCS
              </div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                100%
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                COMPLETE
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}