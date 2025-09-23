import React from "react";
import {
  FileText,
  Filter,
  BarChart3,
  Shield,
  Upload,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const Services = () => {
  const features = [
    {
      icon: FileText,
      title: "Resume Intelligence",
      description:
        "Automatically extract key candidate details from multiple formats (PDF, DOCX, TXT, etc.)",
      benefits: [
        "Instant data extraction",
        "Multiple format support",
        "Structured candidate profiles",
        "Error-free parsing",
      ],
    },
    {
      icon: Upload,
      title: "Bulk Uploads",
      description:
        "Upload entire folders of resumes in a few clicks without worrying about file formats or structure",
      benefits: [
        "Mass resume processing",
        "Drag-and-drop interface",
        "Format flexibility",
        "Time-saving automation",
      ],
    },
    {
      icon: Filter,
      title: "Dynamic Filtering",
      description:
        "Easily filter candidates by skills, experience, and roles with intelligent matching algorithms",
      benefits: [
        "Advanced search filters",
        "Skill-based matching",
        "Experience weighting",
        "Role compatibility",
      ],
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Visualize hiring trends, progress, and candidate data with comprehensive reporting tools",
      benefits: [
        "Real-time insights",
        "Hiring funnel tracking",
        "Performance metrics",
        "Custom reports",
      ],
    },
    {
      icon: Shield,
      title: "Data Privacy",
      description:
        "Process resumes locally without exposing sensitive candidate information to external servers",
      benefits: [
        "Local processing",
        "GDPR compliant",
        "Data encryption",
        "Privacy protection",
      ],
    },
    {
      icon: Users,
      title: "Collaborative Workflows",
      description:
        "Seamlessly integrate with existing HR tools and workflows for team collaboration",
      benefits: [
        "Team collaboration",
        "HR tool integration",
        "Workflow automation",
        "Multi-user access",
      ],
    },
  ];

  const packages = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small businesses and startups",
      features: [
        "Up to 100 resume scans/month",
        "Basic filtering options",
        "Standard analytics",
        "Email support",
        "2 user accounts",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing companies",
      features: [
        "Up to 1,000 resume scans/month",
        "Advanced filtering & matching",
        "Comprehensive analytics",
        "Priority support",
        "10 user accounts",
        "API access",
        "Custom integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited resume scans",
        "AI-powered recommendations",
        "Custom analytics & reporting",
        "Dedicated account manager",
        "Unlimited user accounts",
        "Advanced API access",
        "Custom workflows",
        "On-premise deployment",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Comprehensive AI-powered recruitment solutions designed to
            streamline your hiring process and help you find the perfect
            candidates faster than ever before.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Key Features
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Upload Resumes
              </h3>
              <p className="text-gray-600">
                Bulk upload resumes in any format - PDF, DOCX, TXT, or entire
                folders at once.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                AI Processing
              </h3>
              <p className="text-gray-600">
                Our AI instantly extracts and structures candidate information
                with 99.8% accuracy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Smart Filtering
              </h3>
              <p className="text-gray-600">
                Filter and rank candidates based on skills, experience, and job
                requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Make Decisions
              </h3>
              <p className="text-gray-600">
                Access detailed analytics and insights to make data-driven
                hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Select the perfect plan for your organization's needs. All plans
            include our core AI features with varying levels of usage and
            support.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 ${
                  pkg.popular
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-800">
                      {pkg.price}
                    </span>
                    <span className="text-gray-600">{pkg.period}</span>
                  </div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center transition-colors ${
                    pkg.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-800 text-white hover:bg-gray-900"
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies who have revolutionized their
            recruitment process with HiRekruit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
};

export default Services;
