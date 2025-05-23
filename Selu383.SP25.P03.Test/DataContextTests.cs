using System.Collections;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Selu383.SP25.P03.Test.Helpers;
using Selu383.SP25.P03.Api;
using FluentAssertions;

namespace Selu383.SP25.P03.Test;

[TestClass]
public class DataContextTests
{
    private WebTestContext context = new();

    [TestInitialize]
    public void Init()
    {
        context = new WebTestContext();
    }

    [TestCleanup]
    public void Cleanup()
    {
        context.Dispose();
    }

    [TestMethod]
    public void Timezone()
    {
        var tz = TimeZoneInfo.FindSystemTimeZoneById("America/Chicago");
        tz.Should().NotBeNull();
        Console.WriteLine(tz.Id);
        Console.WriteLine(tz.DisplayName);
        Console.WriteLine(tz.StandardName);
        Console.WriteLine(tz);

        Console.WriteLine("");

        var tz2 = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
        tz.Should().NotBeNull();
        Console.WriteLine(tz2.Id);
        Console.WriteLine(tz2.DisplayName);
        Console.WriteLine(tz2.StandardName);
        Console.WriteLine(tz2);
    }

    [TestMethod]
    public void DataContext_IsOneDeclared()
    {
        var type = typeof(Program).Assembly.GetTypes().Where(x => x.IsSubclassOf(typeof(DbContext))).ToList();
        Assert.IsTrue(type.Count > 0, "You don't have a DbContext declared yet");
        Assert.IsFalse(type.Count > 1, "You have more than one data context created");
        Assert.IsTrue(type[0].Name == "DataContext", "You need to call your DbContext class 'DataContext' not " + type[0].Name);
    }

    [TestMethod]
    public void DataContext_RegisteredInServices()
    {
        var type = typeof(Program).Assembly.GetTypes().FirstOrDefault(x => x.IsSubclassOf(typeof(DbContext)));
        if (type == null)
        {
            Assert.Fail("Not ready for this test");
            return;
        }

        using var scope = context.GetServices().CreateScope();
        var dbContext = GetDataContext(scope);

        Assert.IsNotNull(dbContext, "You need to register your DB context");
    }

    [TestMethod]
    public void DataContext_HasTheater()
    {
        using var scope = context.GetServices().CreateScope();
        var dbContext = GetDataContext(scope);
        if (dbContext == null)
        {
            Assert.Fail("Not ready for this test");
            return;
        }

        EnsureSet("Theater", dbContext);
    }

    [TestMethod]
    public void DataContext_HasUser()
    {
        using var scope = context.GetServices().CreateScope();
        var dbContext = GetDataContext(scope);
        if (dbContext == null)
        {
            Assert.Fail("Not ready for this test");
            return;
        }

        EnsureSet("User", dbContext);
    }

    [TestMethod]
    public void DataContext_HasRole()
    {
        using var scope = context.GetServices().CreateScope();
        var dbContext = GetDataContext(scope);
        if (dbContext == null)
        {
            Assert.Fail("Not ready for this test");
            return;
        }

        EnsureSet("Role", dbContext);
    }

    public static List<dynamic> EnsureSet(string modelName, DbContext dataContext)
    {
        var entityType = GetEntityType(modelName);
        var method = dataContext.GetType().GetMethod("Set", BindingFlags.Public | BindingFlags.Instance, null, CallingConventions.Any, new Type[0], null);
        var generic = method?.MakeGenericMethod(entityType);
        dynamic collection = generic?.Invoke(dataContext, null) ?? throw new Exception($"You don't have '{modelName}' registered in your DataContext");

        try
        {
            IEnumerable test = Enumerable.ToList(collection);
            return [.. test.Cast<dynamic>()];
        }
        catch (InvalidOperationException e)
        {
            throw new Exception($"it doesn't look like you registered '{modelName}' on your DbContext", e);
        }
        catch (Exception e)
        {
            throw new Exception($"Attempting to call 'ToList' on your '{modelName}' set didn't work. Are you automatically migrating / seeding on startup?", e);
        }
    }

    private static Type GetEntityType(string entityTypeName)
    {
        try
        {
            var entityType = typeof(Program).Assembly.GetTypes().Single(x => x.Name == entityTypeName);
            return entityType;
        }
        catch (Exception e)
        {
            throw new Exception($"You don't have the entity '{entityTypeName}' declared at all", e);
        }
    }

    internal static DbContext? GetDataContext(IServiceScope scope)
    {
        try
        {
            var type = typeof(Program).Assembly.GetTypes().Single(x => x.IsSubclassOf(typeof(DbContext)));
            var dataContext = (DbContext)scope.ServiceProvider.GetService(type)!;
            return dataContext;
        }
        catch
        {
            return null;
        }
    }
}
