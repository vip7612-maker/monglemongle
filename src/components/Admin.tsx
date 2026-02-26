import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogOut, CheckCircle2, RotateCcw, Trash2, Download } from 'lucide-react';
import { cn } from '../lib/utils';

export function Admin({
  showAdminLoginModal, setShowAdminLoginModal,
  adminPasswordInput, setAdminPasswordInput, handleAdminLogin,
  showAdminDashboard, setShowAdminDashboard,
  adminTab, setAdminTab, submissions,
  handleDeleteSubmission, handleRestoreSubmission, handlePermanentDeleteSubmission,
  maskName,
  setIsAdminLoggedIn
}: any) {
  return (
    <>
      <AnimatePresence>
        {showAdminLoginModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminLoginModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#5A5A40]" />

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#5A5A40]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-[#5A5A40]" />
                </div>
                <h2 className="font-serif text-3xl mb-2">관리자 로그인</h2>
                <p className="text-sm text-[#5A5A40]/60">대시보드 접속을 위해 비밀번호를 입력하세요</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#5A5A40]/50 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-[#5A5A40]/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 bg-[#fdfcf8] text-center text-xl tracking-[0.5em]"
                    placeholder="••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#5A5A40] text-white py-4 rounded-full font-bold hover:bg-[#4a4a35] transition-all hover:shadow-lg hover:shadow-[#5A5A40]/20 active:scale-[0.98]"
                >
                  로그인
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(false)}
                  className="w-full text-xs text-[#5A5A40]/40 font-bold uppercase tracking-widest hover:text-[#5A5A40] transition-colors"
                >
                  취소
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Dashboard Modal */}
      <AnimatePresence>
        {showAdminDashboard && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminDashboard(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-5xl rounded-[40px] p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl">후원자 관리 대시보드</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      setShowAdminDashboard(false);
                    }}
                    className="flex items-center gap-2 text-sm text-red-500 font-bold"
                  >
                    <LogOut className="w-4 h-4" /> 로그아웃
                  </button>
                  <button
                    onClick={() => setShowAdminDashboard(false)}
                    className="text-sm font-bold text-[#5A5A40]/40"
                  >
                    닫기
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-[#5A5A40]/10">
                <button
                  onClick={() => setAdminTab('commitment')}
                  className={cn(
                    "pb-4 px-2 text-sm font-bold transition-all relative",
                    adminTab === 'commitment' ? "text-[#5A5A40]" : "text-[#5A5A40]/40"
                  )}
                >
                  정기 후원 약정자 ({submissions.filter(s => s.type === 'commitment' && !s.isDeleted).length})
                  {adminTab === 'commitment' && <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5A5A40]" />}
                </button>
                <button
                  onClick={() => setAdminTab('one-time')}
                  className={cn(
                    "pb-4 px-2 text-sm font-bold transition-all relative",
                    adminTab === 'one-time' ? "text-[#5A5A40]" : "text-[#5A5A40]/40"
                  )}
                >
                  일시 후원자 ({submissions.filter(s => s.type === 'one-time' && !s.isDeleted).length})
                  {adminTab === 'one-time' && <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5A5A40]" />}
                </button>
                <button
                  onClick={() => setAdminTab('trash')}
                  className={cn(
                    "pb-4 px-2 text-sm font-bold transition-all relative",
                    adminTab === 'trash' ? "text-red-500" : "text-[#5A5A40]/40"
                  )}
                >
                  휴지통 ({submissions.filter(s => s.isDeleted).length})
                  {adminTab === 'trash' && <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-[#5A5A40]/40 uppercase tracking-widest border-b border-[#5A5A40]/10">
                    <tr>
                      <th className="px-4 py-4">날짜</th>
                      <th className="px-4 py-4">성함</th>
                      <th className="px-4 py-4">연락처</th>
                      <th className="px-4 py-4">대상</th>
                      <th className="px-4 py-4">금액</th>
                      <th className="px-4 py-4">메시지</th>
                      <th className="px-4 py-4">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#5A5A40]/5">
                    {(() => {
                      const filtered = adminTab === 'trash'
                        ? submissions.filter(s => s.isDeleted)
                        : submissions.filter(s => s.type === adminTab && !s.isDeleted);

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="px-4 py-20 text-center text-[#5A5A40]/40">
                              {adminTab === 'trash' ? '휴지통이 비어 있습니다.' : '해당 후원 데이터가 없습니다.'}
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((s) => (
                        <tr key={s.id} className="hover:bg-[#5A5A40]/5 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">{s.date}</td>
                          <td className="px-4 py-4 font-bold">{s.name}</td>
                          <td className="px-4 py-4">{s.phone}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-[#5A5A40]/10 rounded-lg text-[10px] font-bold">
                              {s.target}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-serif">{s.amount.toLocaleString()}원</td>
                          <td className="px-4 py-4 max-w-xs truncate">{s.message || '-'}</td>
                          <td className="px-4 py-4">
                            <div className="flex gap-3">
                              {adminTab === 'trash' ? (
                                <>
                                  <button
                                    onClick={() => handleRestoreSubmission(s.id)}
                                    className="text-blue-400 hover:text-blue-600 transition-colors"
                                    title="복구"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handlePermanentDeleteSubmission(s.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    title="영구 삭제"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleDeleteSubmission(s.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="삭제"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
