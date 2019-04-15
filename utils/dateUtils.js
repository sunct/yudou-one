
let date = new Date();
let cur_year = date.getFullYear();
let cur_month = date.getMonth() + 1;
let weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
let cur_day = date.getDate();
let this_week_day_num = date.getDay();
let prev_year = [];
let prev_month = [];
let next_year = [];
let next_month = [];
let all_show_days = 42;



//获取所有日历相关信息
function all_calendar_data(year, month) {
  var all_calendar_data = [];
  if (year) {
    all_calendar_data['newYear'] = year;
  } else {
    var year = cur_year;
  }
  if (month) {
    all_calendar_data['newMonth'] = month;
  } else {
    var month = cur_month;
  }
  all_calendar_data['cur_year'] = year;
  all_calendar_data['cur_month'] = month;
  all_calendar_data['weeks_ch'] = weeks_ch;
  all_calendar_data['cur_day'] = cur_day;
  // all_calendar_data['this_week_day_num'] = this_week_day_num;
  all_calendar_data['days'] = calculateDays(year, month);

  // all_calendar_data['prev_days'] = prevMonthDays(year, month);
  // all_calendar_data['next_days'] = nextMonthDays(year, month);

  // all_calendar_data['calculateEmptyGrids'] = calculateEmptyGrids(year, month);
  all_calendar_data['scrollViewHeight'] = getSystemInfo();
  all_calendar_data['gridwidth'] = setgridwidth();
  // all_calendar_data['getThisMonthDays'] = getThisMonthDays(year, month);
  // all_calendar_data['getFirstDayOfWeek'] = getFirstDayOfWeek(year, month);
  all_calendar_data['showPrevDays'] = showPrevDays(year, month);
  all_calendar_data['showNextDays'] = showNextDays(year, month);


  return all_calendar_data;

}

function getSystemInfo() {
  try {
    const res = wx.getSystemInfoSync();
    return res.windowHeight * res.pixelRatio || 667
  } catch (e) {
    console.log(e);
  }
}
//日历单元格宽度 
function setgridwidth() {
  var imageWidth = wx.getSystemInfoSync().windowWidth;
  return (imageWidth - 40) / 7;
}
//获取这个月的天数
function getThisMonthDays(year, month) {
  return new Date(year, month, 0).getDate();
}
//获取第一个星期的天数
function getFirstDayOfWeek(year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay();
}

//前面是否有空格子
function calculateEmptyGrids(year, month) {
  var calculateEmptyGrids = [];
  const firstDayOfWeek = getFirstDayOfWeek(year, month);
  let empytGrids = [];
  if (firstDayOfWeek > 0) {
    for (let i = 0; i < firstDayOfWeek; i++) {
      empytGrids.push(i);
    }

    calculateEmptyGrids['hasEmptyGrid'] = true;
    calculateEmptyGrids['empytGrids'] = empytGrids;

  } else {
    calculateEmptyGrids['hasEmptyGrid'] = false;
    calculateEmptyGrids['empytGrids'] = [];

  }
  return calculateEmptyGrids;
}

//获取这个月的天数
function calculateDays(year, month) {
  let days = [];

  const thisMonthDays = getThisMonthDays(year, month);

  for (let i = 1; i <= thisMonthDays; i++) {
    days.push(i);
  }
  return days;

}
//获取上一月的天数
function prevMonthDays(year, month) {
  let prev_arr = [];
  prev_month = month - 1;
  prev_year = year;
  if (prev_month < 1) {
    prev_year = year - 1;
    prev_month = 12;
  }
  var prev_days = calculateDays(prev_year, prev_month);
  prev_arr['prev_year'] = prev_year;
  prev_arr['prev_month'] = prev_month;
  prev_arr['prev_days'] = prev_days;
  return prev_arr;
}

//获取下一月的天数
function nextMonthDays(year, month) {
  let next_arr = [];
  next_month = month + 1;
  next_year = year;
  if (next_month > 12) {
    next_year = year + 1;
    next_month = 1;
  }
  var next_days = calculateDays(next_year, next_month);
  next_arr['next_year'] = next_year;
  next_arr['next_month'] = next_month;
  next_arr['next_days'] = next_days;
  return next_arr;
}

//获取在当前月页面展示的上月天数
function showPrevDays(year, month) {

  let showPrevDays = {
    prev_year: [],
    prev_month: [],
    prev_days: [],
  };
  //获取上一个月天数
  var getPrevMonthDays = prevMonthDays(year, month);
  var prev_days = getPrevMonthDays['prev_days'];
  // console.log(getPrevMonthDays);
  showPrevDays['prev_year'] = getPrevMonthDays['prev_year'];
  showPrevDays['prev_month'] = getPrevMonthDays['prev_month'];

  // console.log(showPrevDays);
  var showPrevDaysNum = getFirstDayOfWeek(year, month);
  if (showPrevDaysNum > 0) {
    showPrevDays['prev_days'] = prev_days.slice(-showPrevDaysNum);
  } else {
    showPrevDays['prev_days'] = null;
  }
  return showPrevDays;
}

//获取在当前月页面展示的下月天数
function showNextDays(year, month) {
  let showNextDays = {
    next_year: [],
    next_month: [],
    next_days: [],

  };
  //获取下一个月需要展示的天数
  //先获取上一个月和本月的天数和，然后需要展示的总数做差
  var showPrevDaysNum = getFirstDayOfWeek(year, month);
  var thisMonthDays = getThisMonthDays(year, month);
  var getnextMonthDays = nextMonthDays(year, month);


  showNextDays['next_year'] = getnextMonthDays['next_year'];
  showNextDays['next_month'] = getnextMonthDays['next_month'];
  showNextDays['next_days'] = [];
  var showNextDaysNum = all_show_days - showPrevDaysNum - thisMonthDays;
  for (let i = 1; i <= showNextDaysNum; i++) {
    showNextDays['next_days'].push(i);
  }
  return showNextDays;
}

//切换年月份
function handleCalendar(handle, cur_year, cur_month) {
  var handleCalendar_data = [];
  var cur_year = cur_year;
  var cur_month = cur_month;
  let newMonth = [];
  let newYear = [];
  if (handle === 'prev') {
    newMonth = cur_month - 1;
    newYear = cur_year;
    if (newMonth < 1) {
      newYear = cur_year - 1;
      newMonth = 12;
    }

  } else {
    newMonth = cur_month + 1;
    newYear = cur_year;
    if (newMonth > 12) {
      newYear = cur_year + 1;
      newMonth = 1;
    }
  }
  handleCalendar_data = all_calendar_data(newYear, newMonth);

  return handleCalendar_data;
}
// 数字小于10的时候前面补0
function handleNum(num) {
  var newnum = '';
  if (num < 10) {
    newnum = '0' + num;
  } else {
    newnum = '' + num;
  }
  return newnum;
}

//日期推延+1或-1,拼接成字符串 比如 20180503,20150504
function handleTime(year, month, day,status) {
  var time_arr={};
  var time_str = '';
  //先获取该年该月的天数
  var thisMonthDays = getThisMonthDays(year, month);
  //判断传入的天数是否在该月第一天,最后一天
  if (day == 1 && status=='-1') {
    //获取上一个月的最后一天(可能会跨年)
    var getPrevMonthDays = prevMonthDays(year, month);
    var prev_year = getPrevMonthDays['prev_year'];
    var prev_month = getPrevMonthDays['prev_month'];
    var prev_month_length = getPrevMonthDays['prev_days'].length;

    time_str = prev_year + '-' + handleNum(prev_month) + '-' + handleNum(prev_month_length);
    year = prev_year;
    month = prev_month;
    day = prev_month_length;

  } else if (day == thisMonthDays && status == '+1') {
    //获取下一个月的第一天(可能会跨年)
    var getnextMonthDays = nextMonthDays(year, month);
    var next_year = getnextMonthDays['next_year'];
    var next_month = getnextMonthDays['next_month'];
    var next_month_length = getnextMonthDays['next_days'].length;
    time_str = next_year + '-' + handleNum(next_month) + '-' + handleNum(1);
    year = next_year;
    month = next_month;
    day = 1;
  } else if (status == '-1'){
    time_str = year + '-' + handleNum(month) + '-' + handleNum(day-1);
    year = year;
    month = month;
    day = day - 1;
  } else if (status == '+1'){
    time_str = year + '-' + handleNum(month) + '-' + handleNum(day+1);
    year = year;
    month = month;
    day = day+1;
  }
  return time_arr = {
    'time_str': time_str, 'year': year, 'month': month, 'day': day};
}
module.exports = {
  all_calendar_data: all_calendar_data,
  handleCalendar: handleCalendar,
  handleNum: handleNum,
  handleTime: handleTime
}  
