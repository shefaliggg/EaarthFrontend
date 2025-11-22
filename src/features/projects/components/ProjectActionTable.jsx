import { motion } from 'framer-motion'
import * as Icon from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { convertTitleToUrl } from '../../../shared/config/utils';

function ProjectActionTable({ files, selectedItems, toggleSelect }) {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        // onClick={() => navigate(convertTitleToUrl(feature.label))}
        >

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 w-10 py-3 text-xs font-bold text-gray-700"> </th>
                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-700">NAME</th>
                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-700">SIZE</th>
                            <th className="text-left px-6 py-3 text-xs font-bold text-gray-700">MODIFIED</th>
                            <th className="text-right px-6 py-3 text-xs font-bold text-gray-700">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => {
                            const CurrentIcon = Icon[file.icon] || Icon.HelpCircle;
                            return (
                                <tr
                                    key={file.id}
                                    className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${selectedItems.includes(file.id) ? 'bg-purple-50' : ''
                                        }`}
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            aria-label={`select ${file.name}`}
                                            type="checkbox"
                                            checked={selectedItems.includes(file.id)}
                                            onChange={(e) => toggleSelect(file.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => navigate(convertTitleToUrl(file.name))}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 flex-shrink-0">
                                                <CurrentIcon className="w-6 h-6 text-lavender-500" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{file.name}</div>
                                                <div className="text-xs text-gray-400">{file.modified}</div>
                                            </div>
                                            {file.starred && (
                                                <Icon.Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            )}
                                            {file.shared && (
                                                <Icon.Share2 className="w-4 h-4 text-blue-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{file.size || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{file.modified}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => alert('Download ' + file.name)}>
                                                <Icon.Download className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => alert('Share ' + file.name)}>
                                                <Icon.Share2 className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Icon.MoreVertical className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

export default ProjectActionTable