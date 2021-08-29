using System;
using System.Collections.Generic;
using System.Text;

namespace Ramsay.SystemFramework.Entities.Find
{
    public class FindBase
    {
        #region Atributes

        private int _Page_Size = 20;
        private int _Page_Number = 1;
        private int _Count = 0;

        #endregion

        #region Properties

        public int Page_Size { get { return _Page_Size; } set { _Page_Size = value; } }
        public int Page_Number { get { return _Page_Number; } set { _Page_Number = value; } }
        public int Count { get { return _Count; } set { _Count = value; } }

        #endregion


        #region

        public FindBase()
        {
            this.Page_Number = 10;
            this.Page_Number = 1;
        }

        #endregion
    }
}
