using Microsoft.Extensions.Configuration;
using Ramsay.DataAccess.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using sfEntities = Ramsay.SystemFramework.Entities;

namespace Ramsay.DataAccess.DataModels
{
    public class Student : IDatabase<sfEntities.Student.Student, sfEntities.Find.Student>
    {
        public sfEntities.Find.Student sfFind { get; set; }
        private IConfiguration _config;

        public Student(IConfiguration config)
        {
            this._config = config;
        }

        /// <summary>
        /// Add a new Student
        /// </summary>
        /// <param name="objStudent"></param>
        /// <returns></returns>
        public sfEntities.Student.Student Insert(sfEntities.Student.Student objStudent)
        {
            sfEntities.Student.Student result = null;
            using (var context = new DBModel.StudentDBContext(_config))
            {
                DBModel.Student newStudent = new DBModel.Student()
                {
                    Username = objStudent.Username,
                    FirstName = objStudent.FirstName,
                    LastName = objStudent.LastName,
                    Age = objStudent.Age,
                    Career = objStudent.Career
                };
                context.Student.Add(newStudent);
                context.SaveChanges();
                context.Entry(newStudent).GetDatabaseValues();
                objStudent.Id = newStudent.Id;
                result = objStudent;
            }
            return result;
        }


        /// <summary>
        /// Update a Student by Id
        /// </summary>
        /// <param name="objStudent"></param>
        /// <returns></returns>
        public sfEntities.Student.Student Update(sfEntities.Student.Student objStudent)
        {
            sfEntities.Student.Student result = null;
            using (var context = new DBModel.StudentDBContext(_config))
            {
                var std = context.Student.Find(objStudent.Id);
                if (std != null)
                {
                    std.FirstName = objStudent.FirstName;
                    std.LastName = objStudent.LastName;
                    std.Age = objStudent.Age;
                    std.Career = objStudent.Career;

                    context.Student.Update(std);
                    context.SaveChanges();
                    result = new sfEntities.Student.Student()
                    {
                        Id = std.Id,
                        Username = std.Username,
                        FirstName = std.FirstName,
                        LastName = std.LastName,
                        Age = std.Age,
                        Career = std.Career
                    };
                }               
            }
            return result;
        }

        /// <summary>
        /// Delete a Student by Id
        /// </summary>
        /// <param name="objStudent"></param>
        /// <returns></returns>
        public bool Delete(sfEntities.Student.Student objStudent)
        {
            bool result = false;
            using (var context = new DBModel.StudentDBContext(_config))
            {
                Expression<Func<DBModel.Student, bool>> whereClause = a => a.Id.Equals(objStudent.Id);
                var item = context.Student.FirstOrDefault(whereClause);
                if (item != null)
                {
                    context.Remove(item);
                    context.SaveChanges();
                    result = true;
                }
            }
            return result;
        }

        /// <summary>
        /// Get a Student by Id or username
        /// </summary>
        /// <returns></returns>
        public sfEntities.Student.Student Get()
        {
            sfEntities.Student.Student result = null;
            using (var context = new DBModel.StudentDBContext(_config))
            {
                DBModel.Student item = null;
                if (sfFind.Id != null && sfFind.Id != 0)
                {
                    Expression<Func<DBModel.Student, bool>> whereClause = a => a.Id.Equals(sfFind.Id);
                    item = context.Student.FirstOrDefault(whereClause);
                }
                else if (!string.IsNullOrEmpty(sfFind.Username))
                {
                    Expression<Func<DBModel.Student, bool>> whereClause = a => a.Username.Equals(sfFind.Username);
                    item = context.Student.FirstOrDefault(whereClause);
                }    
                if (item != null)
                {
                    result = new sfEntities.Student.Student()
                    {
                        Id = item.Id,
                        Username = item.Username,
                        FirstName = item.FirstName,
                        LastName = item.LastName,
                        Age = item.Age,
                        Career = item.Career
                    };
                }
            }
            return result;
        }

        /// <summary>
        /// List a Students by search params or all Students
        /// </summary>
        /// <returns></returns>
        public List<sfEntities.Student.Student> List()
        {
            List<sfEntities.Student.Student> result = new List<sfEntities.Student.Student>();
            using (var context = new DBModel.StudentDBContext(_config))
            {
                if (sfFind == null) sfFind = new sfEntities.Find.Student();

                var query = context.Student.Where(x => x.Id > 0);
                if (!string.IsNullOrEmpty(sfFind.FirstName)) query = query.Where(f => f.FirstName == sfFind.FirstName);
                if (!string.IsNullOrEmpty(sfFind.LastName)) query = query.Where(f => f.FirstName == sfFind.LastName);
                if (sfFind.Age > 0) query = query.Where(f => f.Age == sfFind.Age);

                var std = query.Select(f => f)
                    //.OrderBy(p => p.Age)
                    .Skip(sfFind.Page_Size * (sfFind.Page_Number - 1))
                    .Take(sfFind.Page_Size).ToList();
                result = new List<sfEntities.Student.Student>();
                foreach (var item in std)
                {
                    result.Add(new sfEntities.Student.Student()
                    {
                        Id = item.Id,
                        Username = item.Username,
                        FirstName = item.FirstName,
                        LastName = item.LastName,
                        Age = item.Age,
                        Career = item.Career
                    });
                }
            }
            return result;
        }

    }
}
