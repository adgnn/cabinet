export default {
    setAllCases(state, val) {
        //设置所有案件
        state.allCases = val;
    },
    setToken(state, val) {
        //设置token
        state.token = val;
    },
    setCaseReview_noSee(state, val) {
        //设置未审核案件
        state.caseReview_noSee = val;
    },
    setCaseReview_yes(state, val) {
        //设置审核通过案件
        state.caseReview_yes = val;
    },
    setCaseReview_no(state, val) {
        //设置审核未通过案件
        state.caseReview_no = val;
    },
    setStayCase(state, val) {
        //设置待办案件
        state.stayCase = val;
    },
    setWorkCase(state, val) {
        //设置在办案件
        state.workCase = val;
    },
    setHistoryCase(state, val) {
        //设置历史案件
        state.historyCase = val;
    },
    setFileCase(state, val) {
        //设置归档案件
        state.fileCase = val;
    },
    setUserList(state, val) {
        //设置所有账户列表
        state.userList = val;
    },
    setTrack(state, val) {
        //设置留痕日志
        state.track = val;
    },
    setLabelProfession_in(state, val) {
        //设置标签--职业或者身份(校内)
        state.labelProfession_in = val;
    },
    setLabelProfession_out(state, val) {
        //设置标签--职业或者身份(校外)
        state.labelProfession_out = val;
    },
    setLabelPosition(state, val) {
        //设置标签--职业或者身份
        state.labelPosition = val;
    },
    setLabelType(state, val) {
        //设置标签--职业或者身份
        state.labelType = val;
    },
    setSuspect(state, val) {
        //设置嫌疑人库
        state.suspectList = val;
    },
    setRole(state, val) {
        //设置身份类别
        state.role = val;
    }
}