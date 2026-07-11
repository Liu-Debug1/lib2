#include "rclcpp/rclcpp.hpp"

#include "geometry_msgs/msg/twist.hpp"
#include "std_msgs/msg/bool.hpp"
#include "std_msgs/msg/float32.hpp"
#include "sensor_msgs/msg/imu.hpp"
#include "sensor_msgs/msg/magnetic_field.hpp"
#include "sensor_msgs/msg/joint_state.hpp"

class DriverNode : public rclcpp::Node
{
public:
    DriverNode() : Node("driver_node")
    {
        // 实例化底层小车驱动对象
        car_ = std::make_shared<RosmasterCpp>();

        // 创建订阅者
        sub_cmd_vel_ = this->create_subscription<geometry_msgs::msg::Twist>(
            "cmd_vel",
            1,
            std::bind(&DriverNode::cmdVelCallback, this, std::placeholders::_1));

        sub_buzzer_ = this->create_subscription<std_msgs::msg::Bool>(
            "Buzzer",
            100,
            std::bind(&DriverNode::buzzerCallback, this, std::placeholders::_1));

        // 创建发布者
        edition_pub_ = this->create_publisher<std_msgs::msg::Float32>("edition", 100);
        voltage_pub_ = this->create_publisher<std_msgs::msg::Float32>("voltage", 100);
        joint_state_pub_ = this->create_publisher<sensor_msgs::msg::JointState>("joint_states", 100);
        vel_pub_ = this->create_publisher<geometry_msgs::msg::Twist>("vel_raw", 50);
        imu_pub_ = this->create_publisher<sensor_msgs::msg::Imu>("/imu/data_raw", 100);
        mag_pub_ = this->create_publisher<sensor_msgs::msg::MagneticField>("/imu/mag", 100);

        // 定时读取底层数据并发布
        timer_ = this->create_wall_timer(
            std::chrono::milliseconds(50),
            std::bind(&DriverNode::publishSensorData, this));
    }

private:
    // 假设存在的 C++ 小车底层驱动对象
    std::shared_ptr<RosmasterCpp> car_;

    // 订阅者
    rclcpp::Subscription<geometry_msgs::msg::Twist>::SharedPtr sub_cmd_vel_;
    rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr sub_buzzer_;

    // 发布者
    rclcpp::Publisher<std_msgs::msg::Float32>::SharedPtr edition_pub_;
    rclcpp::Publisher<std_msgs::msg::Float32>::SharedPtr voltage_pub_;
    rclcpp::Publisher<sensor_msgs::msg::JointState>::SharedPtr joint_state_pub_;
    rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr vel_pub_;
    rclcpp::Publisher<sensor_msgs::msg::Imu>::SharedPtr imu_pub_;
    rclcpp::Publisher<sensor_msgs::msg::MagneticField>::SharedPtr mag_pub_;

    rclcpp::TimerBase::SharedPtr timer_;

    void cmdVelCallback(const geometry_msgs::msg::Twist::SharedPtr msg)
    {
        double vx = msg->linear.x;
        double vy = msg->linear.y;
        double angular = msg->angular.z;

        // 调用底层驱动控制小车运动
        car_->setMotion(vx, vy, angular);
    }

    void buzzerCallback(const std_msgs::msg::Bool::SharedPtr msg)
    {
        // 调用底层驱动 控制蜂鸣器
        car_->setBuzzer(msg->data);
    }

    void publishSensorData()
    {
        std_msgs::msg::Float32 edition;
        std_msgs::msg::Float32 battery;
        sensor_msgs::msg::Imu imu;
        sensor_msgs::msg::MagneticField mag;
        geometry_msgs::msg::Twist twist;

        // 读取底层硬件信息
        edition.data = car_->getVersion() * 1.0;
        battery.data = car_->getBatteryVoltage() * 1.0;

        auto accel = car_->getAccelerometerData();
        auto gyro = car_->getGyroscopeData();
        auto magnet = car_->getMagnetometerData();
        auto motion = car_->getMotionData();

        // 填充 IMU
        imu.linear_acceleration.x = accel.x;
        imu.linear_acceleration.y = accel.y;
        imu.linear_acceleration.z = accel.z;

        imu.angular_velocity.x = gyro.x;
        imu.angular_velocity.y = gyro.y;
        imu.angular_velocity.z = gyro.z;

        // 填充磁力计
        mag.magnetic_field.x = magnet.x;
        mag.magnetic_field.y = magnet.y;
        mag.magnetic_field.z = magnet.z;

        // 填充速度反馈
        twist.linear.x = motion.vx;
        twist.linear.y = motion.vy;
        twist.angular.z = motion.angular;

        // 发布话题数据
        imu_pub_->publish(imu);
        mag_pub_->publish(mag);
        voltage_pub_->publish(battery);
        edition_pub_->publish(edition);
        vel_pub_->publish(twist);
    }
};

int main(int argc, char **argv)
{
    rclcpp::init(argc, argv);
    auto node = std::make_shared<DriverNode>();
    rclcpp::spin(node);
    rclcpp::shutdown();
    return 0;
}