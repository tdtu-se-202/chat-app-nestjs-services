from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.database import Postgresql
from diagrams.azure.compute import AppServices
from diagrams.custom import Custom

with Diagram("Chatty App Architecture", show=False):

    with Cluster("Client"):
        browser = Custom("Browser", "./assets/browser.png")
        electron_proxy = Custom("Electron Application", "./assets/electron-icon.png")

        with Cluster("Desktop Apps"):
            mac = Custom("macOS", "./assets/macos.png")
            linux = Custom("Linux", "./assets/linux.png")
            windows = Custom("Windows", "./assets/windows.png")

        electron_apps = [mac, linux, windows]
        for app in electron_apps:
            app >> Edge(label="Runs On") >> electron_proxy

    with Cluster("Database"):
        elephantsql = Custom("ElephantSQL", "./assets/elephantsql.png")
        database = Postgresql("Database")
        database >> Edge(label="Hosted On") >> elephantsql

    cloudinary = Custom("Cloudinary", "./assets/cloudinary.png")

    with Cluster("Server"):
        web_service = AppServices("Azure Web App")
        backend = Custom("NestJS", "./assets/nestjs.png")
        socket_io = Custom("Socket.io", "./assets/socket-io.png")

        backend >> Edge(label="Events") >> socket_io
        backend >> Edge(label="Queries") >> database
        backend >> Edge(label="Upload files") >> cloudinary

    browser >> Edge(label="Requests") >> backend
    electron_proxy >> Edge(label="Requests") >> backend
