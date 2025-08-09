package service

type Service struct {
	UrlCleanupService UrlCleanupService
}

type Option struct{}

func InitiateService(opt Option) *Service {
	return &Service{
		UrlCleanupService: NewUrlCleanupService(),
	}
}
