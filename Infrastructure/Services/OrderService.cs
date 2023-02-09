using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository basketRepository;
        public readonly IUnitOfWork unitOfWork;

        public OrderService(IBasketRepository basketRepository, IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            this.basketRepository = basketRepository;
        }

        public async Task<Order?> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // 1. Get basket from the repo
            var basket = await basketRepository.GetBasketAsync(basketId);
            // 2. Get items from product repo
            var items = new List<OrderItem>();
            foreach (var item in basket!.Items)
            {
                var productItem = await unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem!.Id, productItem.Name, productItem.PictureUrl!);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }
            // 3. Get delivery method from repo
            var deliveryMethod = await unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            // 4. Calculate subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            // 5. Create order
            var order = new Order(items, deliveryMethod!, buyerEmail, shippingAddress, subtotal);
            // 6. Persist the order
            unitOfWork.Repository<Order>().Add(order);
            var result = await unitOfWork.Complete();

            if (result <= 0)
            {
                return null;
            }

            // 7. Delete the basket
            await basketRepository.DeleteBasketAsync(basketId);

            // 8. Return the order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var specification = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            return await unitOfWork.Repository<Order>().GetEntityWithSpec(specification);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var specification = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await unitOfWork.Repository<Order>().ListAsync(specification);
        }
    }
}