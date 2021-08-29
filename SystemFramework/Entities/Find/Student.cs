using System;
using System.Collections.Generic;
using System.Text;

namespace Ramsay.SystemFramework.Entities.Find
{
    public class Student : FindBase
    {
        #region Properties

        public Int32? Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public short Age { get; set; }

        #endregion
    }
}
