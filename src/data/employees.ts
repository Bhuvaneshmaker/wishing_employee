export interface Employee {
  id: number;
  name: string;
  birthday: string; // MM-DD-YYYY format
  joinDate: string; // YYYY-MM-DD format

}

// Mock employee data - In production, this would be imported from Excel
export const employees: Employee[] = [
  {
    id: 1,
    name: "Hemnath Chandrasekaran",
    birthday: "09-02-1994", // 2-Sep-1994
    joinDate: "2017-05-17", //8-May-17

  },
  {
    id: 2,
    name: "K ShyamalaDevi",
    birthday: "12-07-1980", // 7-Dec-1980
    joinDate: "2019-10-19", //10-Oct-19
    
  },
  {
    id: 3,
    name: "Muthamma Pandu",
    birthday: "02-06-1970", // 6-Feb-1970
    joinDate: "2022-01-15", //1-Feb-20

  },
  {
    id: 4,
    name: "Venkatesh Arumugam",
    birthday: "12-17-1999", // 17-Dec-1999
    joinDate: "2020-11-05", //5-Nov-20

  },
  {
    id: 5,
    name: "Lokesh Venkatesan",
    birthday: "05-10-1996", // 10-May-1996
    joinDate: "2020-12-01", // 1-Dec-20

  },
  {
    id: 6,
    name: "Rathinavel Palaniyandi",
    birthday: "07-07-1995", // 7-Jul-1995
    joinDate:"2020-12-01", // 1-Dec-20

  },
  {
    id: 7,
    name: "S.Karthik",
    birthday: "04-22-1998", // 22-Apr-1998
    joinDate: "2021-04-02", //2-Apr-21

  },
  {
    id: 8,
    name: "S. Shunmugaraj",
    birthday: "02-16-1992", // 16-Feb-1992
    joinDate: "2021-08-23", //23-Aug-21

  },
  {
    id: 9,
    name: "",
    birthday: "04-04-2002", // 4-Apr-2002
    joinDate: "2021-09-20", //20-Sep-21

  },
  {
    id: 10,
    name: "P. Yuvarajasekar",
    birthday: "02-01-2000", // 1-Feb-2000
    joinDate: "2021-11-08", //8-Nov-21

  },
  {
    id: 11,
    name: "P. Sudhakar",
    birthday: "01-09-1988", // 28-Oct-1988
    joinDate: "2021-11-10", //10-Nov-21

  },
  {
    id: 12,
    name: "Ramkumar",
    birthday: "02-24-1995", //24-Feb-1995
    joinDate: "2021-11-01",//1-Nov-21

  }
];
