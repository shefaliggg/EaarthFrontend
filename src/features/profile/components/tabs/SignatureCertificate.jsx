function SignatureCertificate({ profile, signatureImage }) {
  const certificateId = "SIG-" + Date.now();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold tracking-wide text-gray-900">
          Digital Signature Certificate
        </h2>
        <p className="text-xs text-gray-500">
          This document certifies that the following signature is valid and
          recorded
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-200" />

      {/* User Info */}
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Signed By</p>
          <p className="font-medium text-gray-900">
            {profile?.name || "User Name"}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Date</p>
          <p className="font-medium text-gray-900">
            {new Date().toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Signature Type</p>
          <p className="font-medium text-gray-900">Digital Signature</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Certificate ID</p>
          <p className="font-mono text-xs text-gray-700">{certificateId}</p>
        </div>
      </div>

      {/* Signature Preview */}
      <div className="border rounded-xl p-6 flex justify-center bg-gray-50">
        <img
          src={signatureImage}
          alt="signature"
          className="max-h-24 object-contain"
        />
      </div>

      {/* Verification Section */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
        <div>
          Verified by system
          <span className="ml-1 font-medium text-gray-700">
            • Secure Digital Record
          </span>
        </div>

        <div className="text-green-600 font-mono">✓ VALID</div>
      </div>
    </div>
  );
}

export default SignatureCertificate;
