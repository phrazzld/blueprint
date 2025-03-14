package cli

// ProjectConfig holds the configuration for a new project
type ProjectConfig struct {
	// Basic project information
	Name        string
	Description string
	
	// Technology stack
	TechStack string
	
	// Feature flags
	Dockerization bool
	Analytics     string
	TestFramework string
	FeatureFlags  bool
}