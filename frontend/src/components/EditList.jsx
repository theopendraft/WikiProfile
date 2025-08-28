import React from 'react';
import { motion } from 'framer-motion';

function EditList({ isLoading, error, edits = [], searchedUser, offset = 0, hasMore = false, onNext, onPrev }) {
    if (isLoading) {
        return (
            <div className="text-center p-10 text-slate-500 font-medium">
                Loading edits...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (!searchedUser) {
        return null;
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Wikimedia Logo with color palette and animation */}
            <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 8 }}
                className="flex justify-center mb-4"
            >
                <svg width="54" height="54" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="28" stroke="#00669A" strokeWidth="4" fill="#fff" />
                    <circle cx="30" cy="30" r="12" fill="#2F9A67" />
                    <path d="M30 10 A20 20 0 1 1 29.99 10.01" stroke="#9B0000" strokeWidth="4" fill="none" />
                </svg>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center tracking-tight" style={{ color: '#00669A' }}>
                Results for: <span className="text-[#9B0000]">{searchedUser}</span>
            </h2>
            {edits.length > 0 ? (
                <>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {edits.map((edit, idx) => (
                            <motion.div
                                key={edit.revid ? edit.revid : (edit.title || idx)}
                                className="border-2 border-[#2F9A67] rounded-xl p-5 bg-gradient-to-br from-[#f8fafc] via-[#e6f4f1] to-[#f0f8fa] shadow-sm group hover:shadow-lg hover:border-[#9B0000] transition-all duration-200"
                                whileHover={{ scale: 1.025, boxShadow: '0 6px 24px #00669A22' }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                <a
                                    href={`https://${edit.project || edit.wiki}/wiki/${encodeURIComponent(edit.full_page_title || edit.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg font-semibold underline-offset-2 transition-colors duration-200 group-hover:text-[#9B0000] text-[#00669A] hover:text-[#2F9A67]"
                                >
                                    {edit.full_page_title || edit.title}
                                </a>
                                <div className="text-sm text-slate-600 mt-2">
                                    <span className="font-semibold text-[#2F9A67]">Wiki:</span> {edit.project || edit.wiki} <span className="mx-2">|</span> <span className="font-semibold text-[#9B0000]">Date:</span> {new Date(edit.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                                {edit.comment && (
                                    <motion.p
                                        className="text-sm text-slate-700 italic mt-3 bg-[#e6f4f1] p-3 rounded-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {edit.comment}
                                    </motion.p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
                        <motion.button
                            onClick={onPrev}
                            disabled={offset === 0}
                            className="px-6 py-2 bg-[#00669A] text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:from-[#00669A] hover:to-[#9B0000] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={offset === 0 ? {} : { scale: 1.05 }}
                            whileTap={offset === 0 ? {} : { scale: 0.98 }}
                        >
                            Previous 10
                        </motion.button>
                        <span className="text-slate-500 text-lg font-medium">Page {Math.floor(offset / 10) + 1}</span>
                        <motion.button
                            onClick={onNext}
                            disabled={!hasMore}
                            className="px-6 py-2 bg-[#00669A] text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:from-[#00669A] hover:to-[#9B0000] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={!hasMore ? {} : { scale: 1.05 }}
                            whileTap={!hasMore ? {} : { scale: 0.98 }}
                        >
                            Next 10
                        </motion.button>
                    </div>
                </>
            ) : (
                <p className="text-center p-10 text-slate-500 font-medium">
                    No global edits found for this user.
                </p>
            )}
        </div>
    );

}

export default EditList;