using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository basketRepository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IConfiguration configuration;
        public PaymentService(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            this.basketRepository = basketRepository;
            this.unitOfWork = unitOfWork;
            this.configuration = configuration;
        }

        public async Task<CustomerBasket?> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = configuration["StripeSettings:SecretKey"];

            var basket = await basketRepository.GetBasketAsync(basketId);
            var shippingPrice = 0m;

            if (basket != null)
            {
                if (basket.DeliveryMethodId.HasValue)
                {
                    var deliveryMethod = await unitOfWork.Repository<DeliveryMethod>().GetByIdAsync((int)basket.DeliveryMethodId);
                    if (deliveryMethod != null)
                    {
                        shippingPrice = deliveryMethod.Price;
                    }
                }


                foreach (var item in basket.Items)
                {
                    var productItem = await unitOfWork.Repository<Core.Entities.Product>().GetByIdAsync(item.Id);
                    if (productItem != null && item.Price != productItem.Price)
                    {
                        item.Price = productItem.Price;
                    }
                }

                var service = new PaymentIntentService();
                PaymentIntent intent;

                if (string.IsNullOrEmpty(basket.PaymentIntentId))
                {
                    var options = new PaymentIntentCreateOptions
                    {
                        Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                        Currency = "usd",
                        PaymentMethodTypes = new List<string> { "card" }
                    };
                    intent = await service.CreateAsync(options);
                    basket.PaymentIntentId = intent.Id;
                    basket.ClientSecret = intent.ClientSecret;
                }
                else
                {
                    var options = new PaymentIntentUpdateOptions
                    {
                        Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100
                    };
                    await service.UpdateAsync(basket.PaymentIntentId, options);
                }

                await basketRepository.UpdateBasketAsync(basket);
            }

            return basket;
        }
    }
}