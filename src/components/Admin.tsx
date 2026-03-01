import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogOut, CheckCircle2, RotateCcw, Trash2, Download, Eye, X } from 'lucide-react';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';

export function Admin({
  showAdminLoginModal, setShowAdminLoginModal,
  adminPasswordInput, setAdminPasswordInput, handleAdminLogin,
  showAdminDashboard, setShowAdminDashboard,
  adminTab, setAdminTab, submissions,
  handleDeleteSubmission, handleRestoreSubmission, handlePermanentDeleteSubmission,
  maskName,
  setIsAdminLoggedIn
}: any) {
  const [selectedSubmission, setSelectedSubmission] = React.useState<any>(null);

  const handleExportExcel = () => {
    const filtered = adminTab === 'trash'
      ? submissions.filter((s: any) => s.isDeleted)
      : submissions.filter((s: any) => s.type === adminTab && !s.isDeleted);

    if (filtered.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    const dataToExport = filtered.map((s: any) => ({
      "날짜": s.date,
      "성함": s.name,
      "연락처": s.phone,
      "후원대상": s.target,
      "금액": s.amount,
      "메시지": s.message || "",
      "유형": s.type === 'commitment' ? '정기약정' : '일시후원'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sponsors");
    XLSX.writeFile(workbook, `mongle_sponsors_${adminTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSyncGoogleSheets = async () => {
    try {
      const res = await fetch('/api/export-google-sheets', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert("구글 시트 동기화 성공!");
      } else {
        alert("동기화 실패: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("동기화 중 오류가 발생했습니다.");
    }
  };
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
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5A5A40]/5 hover:bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl text-sm font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" /> 엑셀 다운로드
                  </button>
                  <button
                    onClick={handleSyncGoogleSheets}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4285F4]/10 hover:bg-[#4285F4]/20 text-[#4285F4] rounded-xl text-sm font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" /> 구글 시트 동기화
                  </button>
                  <div className="h-6 w-px bg-[#5A5A40]/10 mx-2" />
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
                              <button
                                onClick={() => setSelectedSubmission(s)}
                                className="text-[#5A5A40] hover:text-[#4a4a35] transition-colors"
                                title="상세보기"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
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
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-8 right-8 text-[#5A5A40]/40 hover:text-[#5A5A40] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A5A40]/5 text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] mb-4">
                  Submission Details
                </div>
                <h3 className="font-serif text-3xl">{selectedSubmission.name} 님의 후원 상세</h3>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-1">
                  <div className="text-[10px] text-[#5A5A40]/40 uppercase font-bold tracking-widest">날짜</div>
                  <div className="font-medium">{selectedSubmission.date}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-[#5A5A40]/40 uppercase font-bold tracking-widest">연락처</div>
                  <div className="font-medium">{selectedSubmission.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-[#5A5A40]/40 uppercase font-bold tracking-widest">후원 대상</div>
                  <div className="font-medium font-serif bg-[#5A5A40]/5 px-2 py-1 rounded-lg inline-block">
                    {selectedSubmission.target}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-[#5A5A40]/40 uppercase font-bold tracking-widest">후원 금액</div>
                  <div className="font-medium font-serif text-xl text-[#5A5A40]">
                    {selectedSubmission.amount.toLocaleString()}원
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-6 bg-[#fdfcf8] rounded-3xl border border-[#5A5A40]/10">
                <div className="text-[10px] text-[#5A5A40]/40 uppercase font-bold tracking-widest">응원 메시지</div>
                <div className="text-[#5A5A40] leading-relaxed whitespace-pre-line text-lg italic">
                  "{selectedSubmission.message || '메시지가 없습니다.'}"
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-bold hover:bg-[#4a4a35] transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
