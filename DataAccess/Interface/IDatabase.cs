using System;
using System.Collections.Generic;
using System.Text;

namespace Ramsay.DataAccess.Interface
{
    public interface IDatabase<T, U>
    {
        U sfFind { get; set; }
        T Insert(T obj);
        T Update(T obj);
        bool Delete(T obj);
        T Get();
        List<T> List();
    }
}