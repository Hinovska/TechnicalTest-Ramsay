using System;

namespace Ramsay.DataAccess.DBModel
{
    public partial class Student
    {
        public Int32 Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public short Age { get; set; }
        public string Career { get; set; }
    }
}
