package template

import (
	"bytes"
	"fmt"
	"text/template"
)

// TemplateEngine is responsible for processing templates
type TemplateEngine struct {
	Loader *TemplateLoader
}

// NewEngine creates a new template engine
func NewEngine(loader *TemplateLoader) *TemplateEngine {
	return &TemplateEngine{
		Loader: loader,
	}
}

// ProcessTemplate applies data to a template and returns the processed result
func (e *TemplateEngine) ProcessTemplate(templateName string, data interface{}) (string, error) {
	// Load the template content
	content, err := e.Loader.LoadTemplate(templateName)
	if err != nil {
		return "", fmt.Errorf("error loading template: %v", err)
	}
	
	// Parse the template
	tmpl, err := template.New(templateName).Parse(content)
	if err != nil {
		return "", fmt.Errorf("error parsing template: %v", err)
	}
	
	// Apply the data to the template
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", fmt.Errorf("error executing template: %v", err)
	}
	
	return buf.String(), nil
}