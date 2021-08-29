using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Ramsay.DataAccess.DBModel
{
    public partial class StudentDBContext : DbContext
    {
        private string _connectionString;
        public virtual DbSet<Student> Student { get; set; }
        public StudentDBContext(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("SQLiteConnectionString");
        }

        public StudentDBContext(DbContextOptions<StudentDBContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite(_connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasColumnName("Username")
                    .HasMaxLength(20);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasColumnName("FirstName")
                    .HasMaxLength(20);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasColumnName("LastName")
                    .HasMaxLength(20);

                entity.Property(e => e.Age)
                    .IsRequired()
                    .HasColumnName("Age");

                entity.Property(e => e.Career)
                    .IsRequired()
                    .HasColumnName("Career")
                    .HasMaxLength(50);

            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}


