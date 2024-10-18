<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\UserRepositoryInterface;
use App\Repositories\UserRepository;

use App\Repositories\CustomerRepository;
use App\Repositories\CustomerTypeRepository;
use App\Repositories\AddressRepository;
use App\Repositories\VendorRepository;
use App\Repositories\VendorAddressRepository;
use App\Repositories\ProductServiceRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\UnitRepository;
use App\Repositories\ProductBranchRepository;
use App\Repositories\VariationRepository;
use App\Repositories\QrMasterRepository;
use App\Repositories\WarehouseRepository;
use App\Repositories\BranchRepository;
use App\Repositories\PosListRepository;
use App\Repositories\InvoiceRepository;
use App\Repositories\InvoiceProductRepository;
use App\Repositories\PaymentMethodRepository;
use App\Repositories\DeliveryRepository;
use App\Repositories\DeliveryDetailRepository;
use App\Repositories\DeliveryMethodRepository;
use App\Repositories\InvoiceTemplateRepository;
use App\Repositories\InvoiceTypeRepository;
use App\Repositories\InvoicePaymentRepository;
use App\Repositories\PurchaseRepository;
use App\Repositories\PurchaseProductRepository;
use App\Repositories\PurchaseTypeRepository;
use App\Repositories\PurchasePaymentRepository;
use App\Repositories\TransactionRepository;
use App\Repositories\NewsRepository;
use App\Repositories\CalendarRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\MilestoneRepository;
use App\Repositories\ProjectUserRepository;
use App\Repositories\ProjectClientRepository;
use App\Repositories\ProjectAttachmentRepository;
// ~cb-import-service-repositories~
use App\Interfaces\CustomerRepositoryInterface;
use App\Interfaces\CustomerTypeRepositoryInterface;
use App\Interfaces\AddressRepositoryInterface;
use App\Interfaces\VendorRepositoryInterface;
use App\Interfaces\VendorAddressRepositoryInterface;
use App\Interfaces\ProductServiceRepositoryInterface;
use App\Interfaces\CategoryRepositoryInterface;
use App\Interfaces\UnitRepositoryInterface;
use App\Interfaces\ProductBranchRepositoryInterface;
use App\Interfaces\VariationRepositoryInterface;
use App\Interfaces\QrMasterRepositoryInterface;
use App\Interfaces\WarehouseRepositoryInterface;
use App\Interfaces\BranchRepositoryInterface;
use App\Interfaces\PosListRepositoryInterface;
use App\Interfaces\InvoiceRepositoryInterface;
use App\Interfaces\InvoiceProductRepositoryInterface;
use App\Interfaces\PaymentMethodRepositoryInterface;
use App\Interfaces\DeliveryRepositoryInterface;
use App\Interfaces\DeliveryDetailRepositoryInterface;
use App\Interfaces\DeliveryMethodRepositoryInterface;
use App\Interfaces\InvoiceTemplateRepositoryInterface;
use App\Interfaces\InvoiceTypeRepositoryInterface;
use App\Interfaces\InvoicePaymentRepositoryInterface;
use App\Interfaces\PurchaseRepositoryInterface;
use App\Interfaces\PurchaseProductRepositoryInterface;
use App\Interfaces\PurchaseTypeRepositoryInterface;
use App\Interfaces\PurchasePaymentRepositoryInterface;
use App\Interfaces\TransactionRepositoryInterface;
use App\Interfaces\NewsRepositoryInterface;
use App\Interfaces\CalendarRepositoryInterface;
use App\Interfaces\ProjectRepositoryInterface;
use App\Interfaces\MilestoneRepositoryInterface;
use App\Interfaces\ProjectUserRepositoryInterface;
use App\Interfaces\ProjectClientRepositoryInterface;
use App\Interfaces\ProjectAttachmentRepositoryInterface;
// ~cb-import-service-interfaces~

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        
$this->app->bind(CustomerRepositoryInterface::class, CustomerRepository::class);
$this->app->bind(CustomerTypeRepositoryInterface::class, CustomerTypeRepository::class);
$this->app->bind(AddressRepositoryInterface::class, AddressRepository::class);
$this->app->bind(VendorRepositoryInterface::class, VendorRepository::class);
$this->app->bind(VendorAddressRepositoryInterface::class, VendorAddressRepository::class);
$this->app->bind(ProductServiceRepositoryInterface::class, ProductServiceRepository::class);
$this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
$this->app->bind(UnitRepositoryInterface::class, UnitRepository::class);
$this->app->bind(ProductBranchRepositoryInterface::class, ProductBranchRepository::class);
$this->app->bind(VariationRepositoryInterface::class, VariationRepository::class);
$this->app->bind(QrMasterRepositoryInterface::class, QrMasterRepository::class);
$this->app->bind(WarehouseRepositoryInterface::class, WarehouseRepository::class);
$this->app->bind(BranchRepositoryInterface::class, BranchRepository::class);
$this->app->bind(PosListRepositoryInterface::class, PosListRepository::class);
$this->app->bind(InvoiceRepositoryInterface::class, InvoiceRepository::class);
$this->app->bind(InvoiceProductRepositoryInterface::class, InvoiceProductRepository::class);
$this->app->bind(PaymentMethodRepositoryInterface::class, PaymentMethodRepository::class);
$this->app->bind(DeliveryRepositoryInterface::class, DeliveryRepository::class);
$this->app->bind(DeliveryDetailRepositoryInterface::class, DeliveryDetailRepository::class);
$this->app->bind(DeliveryMethodRepositoryInterface::class, DeliveryMethodRepository::class);
$this->app->bind(InvoiceTemplateRepositoryInterface::class, InvoiceTemplateRepository::class);
$this->app->bind(InvoiceTypeRepositoryInterface::class, InvoiceTypeRepository::class);
$this->app->bind(InvoicePaymentRepositoryInterface::class, InvoicePaymentRepository::class);
$this->app->bind(PurchaseRepositoryInterface::class, PurchaseRepository::class);
$this->app->bind(PurchaseProductRepositoryInterface::class, PurchaseProductRepository::class);
$this->app->bind(PurchaseTypeRepositoryInterface::class, PurchaseTypeRepository::class);
$this->app->bind(PurchasePaymentRepositoryInterface::class, PurchasePaymentRepository::class);
$this->app->bind(TransactionRepositoryInterface::class, TransactionRepository::class);
$this->app->bind(NewsRepositoryInterface::class, NewsRepository::class);
$this->app->bind(CalendarRepositoryInterface::class, CalendarRepository::class);
$this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
$this->app->bind(MilestoneRepositoryInterface::class, MilestoneRepository::class);
$this->app->bind(ProjectUserRepositoryInterface::class, ProjectUserRepository::class);
$this->app->bind(ProjectClientRepositoryInterface::class, ProjectClientRepository::class);
$this->app->bind(ProjectAttachmentRepositoryInterface::class, ProjectAttachmentRepository::class);
        // ~cb-service-provider~
        
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
