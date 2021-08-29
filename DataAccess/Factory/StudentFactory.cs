using Ramsay.DataAccess.Interface;
using Microsoft.Extensions.Configuration;
using sfEntities = Ramsay.SystemFramework.Entities;

namespace Ramsay.DataAccess.Factory
{
    /// <summary>
    /// Factory class for Student
    /// </summary>
    public abstract class StudentFactory
    {
        public abstract IDatabase<sfEntities.Student.Student, sfEntities.Find.Student> GetInstance(IConfiguration config);
    }

    /// <summary>
    /// Intance a StudentFactory
    /// </summary>
    public class AgentStudentFactory : StudentFactory
    {
        public override IDatabase<sfEntities.Student.Student, sfEntities.Find.Student> GetInstance(IConfiguration config)
        {
            return new DataAccess.DataModels.Student(config);
        }

    }
}
