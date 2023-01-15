using System.Text.Json;
using Core.Entities;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                if (context.ProductBrands != null && !context.ProductBrands.Any())
                {
                    var brandsData = File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");
                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                    if (brands != null)
                    {
                        foreach (var item in brands)
                        {
                            context.ProductBrands.Add(item);
                        }
                        await context.SaveChangesAsync();
                    }
                }
                if (context.ProductTypes != null && !context.ProductTypes.Any())
                {
                    var typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");
                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
                    if (types != null)
                    {
                        foreach (var item in types)
                        {
                            context.ProductTypes.Add(item);
                        }
                        await context.SaveChangesAsync();
                    }
                }
                if (context.Products != null && !context.Products.Any())
                {
                    var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                    if (products != null)
                    {
                        foreach (var item in products)
                        {
                            context.Products.Add(item);
                        }
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}