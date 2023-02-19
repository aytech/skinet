using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrderByPaymentIntentIdWithItemsSpecification : BaseSpecification<Order>
    {
        public OrderByPaymentIntentIdWithItemsSpecification(string? paymentIntentId)
            : base(o => paymentIntentId != null && o.PaymentIntentId == paymentIntentId) { }
    }
}