namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order() { }

        public Order(IReadOnlyList<OrderItem> orderItems, DeliveryMethod deliveryMethod, string? buyerEmail,
            Address? shipToAddress, decimal subTotal, string? paymentIntentId)
        {
            OrderItems = orderItems;
            DeliveryMethod = deliveryMethod;
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            SubTotal = subTotal;
            PaymentIntentId = paymentIntentId;
        }

        public string? BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public Address? ShipToAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; } = default!;
        public IReadOnlyList<OrderItem> OrderItems { get; set; } = default!;
        public decimal SubTotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string? PaymentIntentId { get; set; }

        public decimal GetTotal()
        {
            return SubTotal + (DeliveryMethod != null ? DeliveryMethod.Price : 0);
        }
    }
}