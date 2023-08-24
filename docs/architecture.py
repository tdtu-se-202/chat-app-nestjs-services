from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.database import Postgresql
from diagrams.azure.compute import AppServices
from diagrams.custom import Custom

with Diagram("Chatty App Architecture", show=False):

    with Cluster("Client Side") as electron_cluster:
        mac = Custom("macOS", "./assets/macos.png")
        linux = Custom("Linux", "./assets/linux.png")
        windows = Custom("Windows", "./assets/windows.png")
        electron_proxy = Custom("Electron Application", "./assets/electron-icon.png")

    with Cluster("Third Party Services"):
        cloudinary = Custom("Cloudinary", "./assets/cloudinary.png")

    with Cluster("Azure Web Service") as azure_cluster:
        web_service = AppServices("Azure Web App")

        with Cluster("Server Side"):
            backend = Custom("NestJS", "./assets/nestjs.png")
            socket_io = Custom("Socket.io", "./assets/socket-io.png")

            with Cluster("Database Host"):
                elephantsql = Custom("ElephantSQL", "./assets/elephantsql.png")
                database = Postgresql("Database")

            backend_proxy = Custom("", "none")  # Hidden node for connections

        # Connections
        cloudinary >> Edge(style="dotted", color="blue") >> backend
        socket_io >> backend
        backend >> database

    electron_apps = [mac, linux, windows]
    for app in electron_apps:
        app >> electron_proxy
    # Connection between React Electron App cluster and Azure Web Service cluster
    electron_proxy >> backend_proxy
